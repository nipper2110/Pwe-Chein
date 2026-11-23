import { Schema, model } from "mongoose";

export interface IFavoriteTeam {
  teamId: number;
  // A snapshot taken when the user follows the team, so the dashboard can show
  // the team without asking API-Football again.
  name: string;
  logo: string;
}

export interface IUser {
  name: string;
  email: string;
  passwordHash: string; // a bcrypt hash, never the real password
  favorites: IFavoriteTeam[];
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavoriteTeam>(
  { teamId: { type: Number, required: true }, name: { type: String, required: true }, logo: { type: String, required: true } },
  { _id: false },
);

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  // unique: no two accounts with the same email. lowercase: "A@x.com" and "a@x.com" are the same person.
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  favorites: { type: [favoriteSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);
