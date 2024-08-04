import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { User } from './User';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Length(10, 255)
    title!: string;

    @Column('text')
    @IsNotEmpty()
    content!: string;

    @ManyToOne(() => User, (user) => user.posts)
    author!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
