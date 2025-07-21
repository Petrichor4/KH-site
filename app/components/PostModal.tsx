import {
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Switch,
  Button,
  Input,
} from "@chakra-ui/react";
import CustomModal from "./customModal";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";


export default function PostModal({
  setVisible,
  handlePost,
  inputFileRef,
  setPost,
  checked,
  setChecked,
  loading,
}: {
  setVisible: (arg0: boolean) => void;
  handlePost: () => void;
  inputFileRef: React.RefObject<HTMLInputElement>;
  setPost: (arg0: string) => void;
  checked: boolean;
  setChecked: (arg0: unknown) => void;
  loading: boolean;
}) {
  const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <CustomModal
      title="New Post"
      isOpen={true}
      onClose={() => setVisible(false)}
    >
      <form onSubmit={handlePost}>
        <Fieldset.Root>
          <Stack>
            <div className="flex flex-wrap md:flex-nowrap items-end gap-2">
              <Field.Root>
                <FieldLabel>Photo</FieldLabel>
                <Input name="photo" />
              </Field.Root>
              <input type="file" ref={inputFileRef} accept="image/*" />
            </div>
            <Field.Root>
              <FieldLabel>Title</FieldLabel>
              <Input name="title" />
            </Field.Root>
            <Field.Root>
              <FieldLabel>Post</FieldLabel>
              <div className="w-full h-fit">
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  placeholder="Compose your epic Kierstyn Hart!"
                  onChange={(value) => setPost(value)}
                  className="w-full h-1/2"
                />
              </div>
            </Field.Root>
          </Stack>
        </Fieldset.Root>
        <div className="flex justify-end mt-4 gap-2">
          <Switch.Root
            colorPalette={"blue"}
            size={"lg"}
            onClick={() => setChecked((prev: boolean) => !prev)}
            checked={checked}
          >
            <Switch.Label className="text-lg">Save as draft?</Switch.Label>
            <Switch.Control />
          </Switch.Root>
          <Button
            type="submit"
            className="hover:bg-black hover:text-white text-lg"
            variant={"ghost"}
            size={"lg"}
            loading={loading}
          >
            Post
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
