"use server";

const waitFor = (ms: number) => new Promise(res => setTimeout(res, ms))

export const testAction = async (data: FormData) => {
  const query = data.get("query");
  await waitFor(1000)
  console.log(`server action test: ${query}`);
};
