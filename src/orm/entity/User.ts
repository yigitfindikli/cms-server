import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Role } from './Role';
import { Post } from './Post';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    firstName!: string;

    @Column({ nullable: true })
    lastName!: string;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column({ nullable: true, select: false })
    @Length(4, 100)
    password!: string;

    @Column({ nullable: true })
    googleId!: string;

    @Column({ nullable: true })
    githubId!: string;

    @Column({ nullable: true })
    imgUrl!: string;

    @Column({ nullable: true, type: 'text' })
    resetPasswordToken!: string | null;

    @Column({ nullable: true, type: 'timestamptz' })
    resetPasswordTokenExpiresAt!: Date | null;

    @ManyToOne(() => Role, (role) => role.users)
    role!: Role;

    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];
}
