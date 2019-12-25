import {Column, DataType, IsEmail, Length, Model, Table, Unique} from 'sequelize-typescript';

@Table({
    timestamps: true,
    paranoid: true,
})
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Unique
    @IsEmail
    @Length({ max: 50})
    @Column({
        type: DataType.STRING,
    })
    email: string;

    @Column({
        type: DataType.STRING,
    })
    password: string;

    @Length({ max: 30 })
    @Column({
        type: DataType.STRING,
    })
    firstName: string;

    @Length({ max: 30 })
    @Column({
        type: DataType.STRING,
    })
    lastName: string;
}
