import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity('links')
export class Link {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column({ nullable: true })
    user_id: string;

    @ManyToMany(() => Product)
    @JoinTable({
        name: "link_products",
        joinColumn: { name: "link_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
    })
    products: Product[];

    @OneToMany(() => Order, order => order.links, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({
        referencedColumnName: 'code',
        name: 'code'
    })
    orders: Order[];
}