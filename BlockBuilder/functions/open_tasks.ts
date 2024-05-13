import {
  Blocks,
  Elements,
  Modal,
  ModalBuilder,
  ModalParams,
  Paginator,
} from "npm:slack-block-builder";

const theModal = (
  { tasks, totalTasks, page, perPage }: {
    // deno-lint-ignore no-explicit-any
    tasks: any[];
    totalTasks: number;
    page: number;
    perPage: number;
  },
) =>
  Modal({ title: "Open Tasks" })
    .blocks(
      Blocks.Section({
        text:
          "Hi! :wave: And welcome to the FAQ section! Take a look around and if you don't find what you need, feel free to open an issue on GitHub.",
      }),
      Blocks.Section({
        text: `You currently have *${totalTasks} open task(s)*:`,
      }),
      Paginator({
        perPage,
        items: tasks,
        totalItems: totalTasks,
        page: page || 1,
        actionId: ({ buttonId, page, offset }) =>
          JSON.stringify({ action: "render-tasks", buttonId, page, offset }),
        blocksForEach: (
          { item }: { item: { title: string; id: number; dueDate: Date } },
        ) => [
          Blocks.Divider(),
          Blocks.Section({ text: `*${item.title}*` })
            .accessory(
              Elements.Button({ text: "View Details" })
                .actionId("view-details")
                .value(item.id.toString()),
            ),
          Blocks.Section({ text: `*Due Date:* ${getDate(item.dueDate)}` }),
        ],
      }).getBlocks(),
    )
    .close("Done")
    .buildToJSON();

const getDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
