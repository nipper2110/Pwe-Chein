import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { User, type IFavoriteTeam } from "../models/User.js";
import { getTeamInfo } from "../services/apiFootball.js";

const MAX_FAVORITES = 20;
const paramsSchema = z.object({ teamId: z.coerce.number().int().positive() });

const toJson = (favorites: IFavoriteTeam[]) => ({
  favorites: favorites.map((f) => ({ teamId: f.teamId, name: f.name, logo: f.logo })),
});

/** GET /api/favorites - the logged-in user's followed teams. */
export async function listFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }
    res.json(toJson(user.favorites));
  } catch (err) {
    next(err);
  }
}

/** PUT /api/favorites/:teamId - follow a team. Safe to repeat (following twice changes nothing). */
export async function followTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid team id" });
    return;
  }
  const { teamId } = parsed.data;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }
    if (user.favorites.some((f) => f.teamId === teamId)) {
      res.json(toJson(user.favorites));
      return;
    }
    if (user.favorites.length >= MAX_FAVORITES) {
      res.status(400).json({ error: `You can follow up to ${MAX_FAVORITES} teams. Unfollow one first.` });
      return;
    }

    // The SERVER looks up the team's name and logo (usually from our cache), so the client cannot send fake data.
    const info = await getTeamInfo(teamId);
    if (!info) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    user.favorites.push({ teamId, name: info.team.name, logo: info.team.logo });
    await user.save();
    res.json(toJson(user.favorites));
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/favorites/:teamId - unfollow a team. Also safe to repeat. */
export async function unfollowTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid team id" });
    return;
  }
  try {
    const user = await User.findByIdAndUpdate(req.userId, { $pull: { favorites: { teamId: parsed.data.teamId } } }, { new: true });
    if (!user) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }
    res.json(toJson(user.favorites));
  } catch (err) {
    next(err);
  }
}
