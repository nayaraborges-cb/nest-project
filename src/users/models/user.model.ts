import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript';


export interface UserAttributes {
  avatarUrl: string;
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

@Table({
  tableName: 'users',
})
export class User extends Model<UserAttributes> implements UserAttributes {
  avatarUrl: string;
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

 @Column({
  type: DataType.STRING,
  allowNull: true,
 })
  declare avatarKey: string;
  
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  declare role: string;

}
