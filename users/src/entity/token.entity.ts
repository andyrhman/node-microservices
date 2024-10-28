import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    token: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    expired_at: Date;

}