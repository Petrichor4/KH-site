import {
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Textarea,
  Button,
  Input,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { HeaderData } from "../lib/definitions";
import { editHeaderData } from "../lib/actions";

export default function HeaderForm({ headerData, setVisible }: { headerData: HeaderData, setVisible: (arg0: boolean)=> void }) {

  const [loading, setLoading] = useState(false);


  const handleEditHeaderData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const heroPhoto = formData.get("heroPhoto")?.toString();
    const selfie = formData.get("portrait")?.toString();
    const bio = formData.get("aboutMe")?.toString();
    try {
      if (!heroPhoto || !selfie || !bio) {
        alert("Make sure there are no empty values");
        return;
      }
      await editHeaderData(heroPhoto, selfie, bio);
      alert("Sucessfully edited header!");
      setVisible(false);
    } catch (error) {
      alert(`Error editing header data: ${error}`);
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(headerData);
  return (
    <form onSubmit={handleEditHeaderData}>
      <Fieldset.Root>
        <Stack>
          <Field.Root>
            <FieldLabel>Hero Photo</FieldLabel>
            <Input name="heroPhoto" defaultValue={headerData.hero_image} />
          </Field.Root>
          <Field.Root>
            <FieldLabel>Portrait</FieldLabel>
            <Input name="portrait" defaultValue={headerData.portrait} />
          </Field.Root>
          <Field.Root>
            <FieldLabel>About Me</FieldLabel>
            <Textarea
              name="aboutMe"
              className="h-40"
              defaultValue={headerData.about_me}
            ></Textarea>
          </Field.Root>
        </Stack>
      </Fieldset.Root>
      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          bg={"#828698"}
          _hover={{ opacity: "50%" }}
          size={"lg"}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </form>
  );
}
