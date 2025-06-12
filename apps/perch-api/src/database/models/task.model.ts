import { DataTypes } from 'sequelize';
import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'tasks' })
export class Task extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.INTEGER,
    comment: 'Unique identifier',
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataTypes.STRING, allowNull: false })
  declare title: string;

  @Column(DataTypes.TEXT)
  declare description?: string;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  declare completed: boolean;
}
