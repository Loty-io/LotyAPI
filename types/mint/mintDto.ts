import z from "zod";

export const CreateMintSchema = z.object({
  wallet: z.string(),
  contractAddress: z.string(),
});

export type CreateMintDto = z.infer<typeof CreateMintSchema>;

export const parseCreateMintDto = (query: unknown): CreateMintDto =>
  CreateMintSchema.parse(query);
