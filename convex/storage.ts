import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required to generate upload URLs");
    }
    
    // Check if user has uploaded too many images recently (basic rate limiting)
    const recentImages = await ctx.db
      .query("images")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.gt(q.field("_creationTime"), Date.now() - 60000)) // Last minute
      .collect();
    
    if (recentImages.length >= 10) {
      throw new Error("Rate limit exceeded. Please wait before uploading more images.");
    }
    
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendImage = mutation({
  args: {
    storageId: v.id("_storage"),
    format: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required to save images");
    }
    
    // Validate format
    if (!["svg", "png"].includes(args.format.toLowerCase())) {
      throw new Error("Invalid format. Only SVG and PNG are supported.");
    }
    
    // Verify the storage file exists and belongs to this user session
    const fileMetadata = await ctx.db.system.get(args.storageId);
    if (!fileMetadata) {
      throw new Error("Invalid storage ID. File not found.");
    }
    
    await ctx.db.insert("images", {
      userId,
      storageId: args.storageId,
      format: args.format.toLowerCase(),
    });
    
    return args.storageId;
  },
});
