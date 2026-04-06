import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Household } from './entities/household.entity';
import { HouseholdMember } from './entities/household-member.entity';
import { User } from '../auth/entities/user.entity';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { HouseholdRole } from '../common/enums/role.enum';

@Injectable()
export class HouseholdsService {
  constructor(
    @InjectRepository(Household)
    private householdRepository: Repository<Household>,
    @InjectRepository(HouseholdMember)
    private memberRepository: Repository<HouseholdMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createHouseholdDto: CreateHouseholdDto,
    userId: string,
  ): Promise<Household> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const household = this.householdRepository.create({
      name: createHouseholdDto.name,
    });
    await this.householdRepository.save(household);

    const member = this.memberRepository.create({
      household,
      user,
      role: HouseholdRole.ADMIN,
    });
    await this.memberRepository.save(member);

    return this.findOne(household.id, userId);
  }

  async findAllForUser(userId: string): Promise<Household[]> {
    const memberships = await this.memberRepository.find({
      where: { user: { id: userId } },
      relations: ['household', 'household.members', 'household.members.user'],
    });

    return memberships.map((m) => m.household);
  }

  async findOne(id: string, userId: string): Promise<Household> {
    const membership = await this.memberRepository.findOne({
      where: { household: { id }, user: { id: userId } },
      relations: ['household', 'household.members', 'household.members.user'],
    });

    if (!membership) {
      throw new NotFoundException('Household not found or you are not a member');
    }

    return membership.household;
  }

  async update(
    id: string,
    updateHouseholdDto: UpdateHouseholdDto,
  ): Promise<Household> {
    const household = await this.householdRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    Object.assign(household, updateHouseholdDto);
    return this.householdRepository.save(household);
  }

  async remove(id: string): Promise<void> {
    const result = await this.householdRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Household not found');
    }
  }

  async getMembers(householdId: string): Promise<HouseholdMember[]> {
    return this.memberRepository.find({
      where: { household: { id: householdId } },
      relations: ['user'],
    });
  }

  async addMember(
    householdId: string,
    addMemberDto: AddMemberDto,
  ): Promise<HouseholdMember> {
    const household = await this.householdRepository.findOne({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    const user = await this.userRepository.findOne({
      where: { email: addMemberDto.email },
    });

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    const existingMember = await this.memberRepository.findOne({
      where: { household: { id: householdId }, user: { id: user.id } },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this household');
    }

    const member = this.memberRepository.create({
      household,
      user,
      role: addMemberDto.role,
    });

    return this.memberRepository.save(member);
  }

  async updateMemberRole(
    householdId: string,
    memberId: string,
    updateDto: UpdateMemberRoleDto,
    currentUserId: string,
  ): Promise<HouseholdMember> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId, household: { id: householdId } },
      relations: ['user'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.user.id === currentUserId && updateDto.role !== HouseholdRole.ADMIN) {
      const adminCount = await this.memberRepository.count({
        where: { household: { id: householdId }, role: HouseholdRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new ForbiddenException(
          'Cannot demote yourself when you are the only admin',
        );
      }
    }

    member.role = updateDto.role;
    return this.memberRepository.save(member);
  }

  async removeMember(
    householdId: string,
    memberId: string,
    currentUserId: string,
  ): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId, household: { id: householdId } },
      relations: ['user'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.user.id === currentUserId) {
      const adminCount = await this.memberRepository.count({
        where: { household: { id: householdId }, role: HouseholdRole.ADMIN },
      });

      if (member.role === HouseholdRole.ADMIN && adminCount <= 1) {
        throw new ForbiddenException(
          'Cannot leave household when you are the only admin',
        );
      }
    }

    await this.memberRepository.remove(member);
  }

  async getMembershipRole(
    householdId: string,
    userId: string,
  ): Promise<HouseholdRole | null> {
    const membership = await this.memberRepository.findOne({
      where: { household: { id: householdId }, user: { id: userId } },
    });

    return membership?.role || null;
  }
}
