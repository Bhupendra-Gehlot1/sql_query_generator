<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { generateQuery } from "../service/AiModal";

  let inputValue = "";
  let outputValue = "";
  let queryResult = "";

  async function handleGenerate() {
    try {
      console.log(inputValue);
      const result = await generateQuery(inputValue);
      outputValue = result;
    } catch (error) {
      console.error("Error generating SQL query:", error);
      outputValue = "An error occurred while generating the SQL query.";
    }
  }
</script>

<div class="p-24 max-w-full mx-auto min-h-screen bg-neutral-800 text-white">
  <h1 class="text-2xl font-bold mb-4">SQL Query Generator</h1>

  <div class="mb-4">
    <Label for="input">Input</Label>
    <Input
      id="input"
      bind:value={inputValue}
      class="bg-neutral-900 text-white"
      placeholder="Enter your query here"
    />
  </div>

  <Button on:click={handleGenerate} class="mb-4 bg-neutral-900">Generate</Button
  >

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card class="p-4 bg-neutral-900 text-white">
      <h2 class="text-xl font-semibold mb-2">Generated SQL Query</h2>
      <Textarea
        bind:value={outputValue}
        class="w-full h-64 bg-neutral-900 text-white"
        placeholder="Generated SQL query will appear here"
      />
    </Card>

    <Card class="p-4 bg-neutral-900 text-white">
      <h2 class="text-xl font-semibold mb-2">Query Result</h2>
      <Textarea
        bind:value={queryResult}
        class="w-full h-64 bg-neutral-900 text-white"
        placeholder="Query result will appear here"
      />
    </Card>
  </div>
</div>
