import { Blocks, Elements, Modal, Paginator } from "npm:slack-block-builder";

const openTasksPaginator = ({ tasks, totalTasks, page, perPage }) =>
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
        blocksForEach: ({ item }) => [
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

const p = Paginator({params: []});
  tasks: [
    {
      title: "Task 1",
      id: 1,
      dueDate: new Date(),
    },
    {
      title: "Task 2",
      id: 2,
      dueDate: new Date(),
    },
    {
      title: "Task 3",
      id: 3,
      dueDate: new Date(),
    },
)}})