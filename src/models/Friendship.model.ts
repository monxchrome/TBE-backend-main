import { model, Schema } from "mongoose";

import { EFriendshipStatus } from "../enums/friendship.enum";

const friendshipSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: EFriendshipStatus,
      default: EFriendshipStatus.PENDING,
    },
  },
  { versionKey: false, timestamps: true },
);

export const Friendship = model("Friendship", friendshipSchema);
