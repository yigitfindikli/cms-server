import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';
import { RoleType } from '../../enums/role';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'enum',
        enum: RoleType,
        unique: true
    })
    name!: RoleType;

    @OneToMany(() => User, (user) => user.role)
    users!: User[];
}
