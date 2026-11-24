import { Schema, model } from "mongoose";
import { LANGUAGES, type Language } from "../utils/languages.js";

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
  /** A bcrypt hash, never the real password. Missing for accounts that were created with Google and never set one. */
  passwordHash?: string;
  /** Google's permanent id for this person (the "sub" in their ID token). Missing for password-only accounts. */
  googleId?: string;
  favorites: IFavoriteTeam[];
  /** The language the user picked. Missing for accounts made before translations existed. */
  language?: Language;
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
  passwordHash: { type: String },
  // unique + sparse: no two users share a Google account, but many users may have none at all.
  googleId: { type: String, unique: true, sparse: true },
  favorites: { type: [favoriteSchema], default: [] },
  language: { type: String, enum: LANGUAGES },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);
