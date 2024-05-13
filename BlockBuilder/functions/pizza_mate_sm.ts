import { Bits, Blocks, Elements, Modal } from "npm:slack-block-builder";

const myModal = () => {
  return Modal()
    .title("PizzaMate")
    .blocks(
      Blocks.Section()
        .text("Hey there, colleague!"),
      Blocks.Section()
        .text(
          "Hurray for corporate pizza! Let's get you fed and happy :pizza:",
        ),
      Blocks.Input()
        .label("What can we call you?")
        .element(
          Elements.TextInput()
            .placeholder("Hi, my name is... (What?!) (Who?!)")
            .actionId("name"),
        ),
      Blocks.Input()
        .label("Which floor are you on?")
        .element(
          Elements.TextInput()
            .placeholder("HQ – Fifth Floor")
            .actionId("floor"),
        ),
      Blocks.Input()
        .label("What'll you have?")
        .element(
          Elements.StaticSelect()
            .placeholder("Choose your favorite...")
            .actionId("item")
            .options(
              Bits.Option().text(":cheese_wedge: With Cheeze").value("012"),
              Bits.Option().text(":fish: With Anchovies").value("013"),
              Bits.Option().text(":cookie: With Scooby Snacks").value("014"),
              Bits.Option().text(":beer: I Prefer Steak and Beer").value("015"),
            ),
        ),
    )
    .submit("Get Fed");
};

Blocks.Section();
