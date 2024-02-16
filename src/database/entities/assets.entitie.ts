import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('assets')
export class Assets {
  @PrimaryGeneratedColumn()
  AssetId: number;

  @Column()
  AssetName: string;

  @Column()
  Where: string;

  @Column()
  When: string;

  @Column()
  AssetType: string;

  @Column()
  Assets: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  CreateAt: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdateAt: Date;
}
