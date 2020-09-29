import { OneToMany, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Oauth } from "./oauth";

//https://www.iana.org/assignments/jwt/jwt.xhtml
@Entity()
export class Client {
  @PrimaryGeneratedColumn("uuid")
  client_id?: string;
  
  @Column()
  client_name?: string;
  
  @Column()
  client_secret?: string;
    
  @Column()
  client_secret_salt?: string;

  @Column()
  redirect_uri: string;

  @Column("datetime")
  created_at: Date;

  @Column("datetime")
  updated_at: Date;

  @Column()
  disabled: boolean;

  //Join tables on user group side
  @OneToMany(() => Oauth, oauth => oauth.client, { nullable: true })
  tokens?: Oauth[];
}