import {
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Textarea,
  Button,
  Input,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { MdOutlineFileUpload } from "react-icons/md";
import { PutBlobResult } from "@vercel/blob";
import { FormEvent, useEffect, useRef, useState } from "react";
import { HeaderData } from "../lib/definitions";
import { editHeaderData } from "../lib/actions";

export default function HeaderForm({
  headerData,
  setVisible,
}: {
  headerData: HeaderData;
  setVisible: (arg0: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [portraitFileName, setPortraitFileName] = useState("Select an image");
  const [heroImageName, setHeroImageName] = useState("Select an image");
  const [blobList, setBlobList] = useState<string[]>([]);
  const inputFileRefHI = useRef<HTMLInputElement>(null);
  const inputFileRefP = useRef<HTMLInputElement>(null);
  console.log(inputFileRefHI);
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0].name);
      console.log(inputFileRefHI);
    }
  };

  useEffect(() => {
  const existingBlob = async () => {
    try {
      setLoading(true);

      // Hit your new Next.js internal API route to bypass CORS
      const response = await fetch('/api/photo/list');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setBlobList(data.urls || []);
    } catch (error) {
      console.error('failed to fetch blobs', error);
      setBlobList([]);
    } finally {
      setLoading(false);
    }
  };
  existingBlob();
}, []);

  console.log(blobList)

  const handleEditHeaderData = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  e.stopPropagation();
  setLoading(true);

  const formData = new FormData(e.currentTarget);
  const bio = formData.get("aboutMe")?.toString();
  
  // Existing text input fallbacks
  const existingHeroUrl = formData.get("heroPhoto")?.toString() || "";
  const existingPortraitUrl = formData.get("portrait")?.toString() || "";

  try {
    if (!bio) {
      alert("About Me section cannot be empty");
      return;
    }

    const heroFile = inputFileRefHI.current?.files?.[0];
    const portraitFile = inputFileRefP.current?.files?.[0];

    let finalHeroUrl = existingHeroUrl;
    let finalPortraitUrl = existingPortraitUrl;

    /// Helper utility to scan the string array for matching filenames
const findExistingUrl = (fileName: string): string | undefined => {
  // Cleans the input name of any spaces/special characters
  const targetName = encodeURIComponent(fileName); 
  
  return blobList.find((url) => {
    // Decodes the URL to handle clean text processing
    const decodedUrl = decodeURIComponent(url);
    
    // Checks if the original filename is anywhere in the URL string
    return decodedUrl.includes(targetName) || decodedUrl.includes(fileName);
  });
};


    // 1. Prioritize Hero Image
    if (heroFile) {
      const matchedUrl = findExistingUrl(heroFile.name);
      
      if (matchedUrl) {
        finalHeroUrl = matchedUrl; // Use existing file URL instead of uploading
      } else {
        const responseHI = await fetch(`/api/photo/upload?filename=${encodeURIComponent(heroFile.name)}`, {
          method: "POST",
          body: heroFile,
        });
        if (!responseHI.ok) throw new Error(`Hero upload failed: ${responseHI.statusText}`);
        const blobHI = (await responseHI.json()) as PutBlobResult;
        finalHeroUrl = blobHI.url;
      }
    }

    // 2. Prioritize Portrait Image
    if (portraitFile) {
      const matchedUrl = findExistingUrl(portraitFile.name);

      if (matchedUrl) {
        finalPortraitUrl = matchedUrl; // Use existing file URL instead of uploading
      } else {
        const responseP = await fetch(`/api/photo/upload?filename=${encodeURIComponent(portraitFile.name)}`, {
          method: "POST",
          body: portraitFile,
        });
        if (!responseP.ok) throw new Error(`Portrait upload failed: ${responseP.statusText}`);
        const blobP = (await responseP.json()) as PutBlobResult;
        finalPortraitUrl = blobP.url;
      }
    }

    // 3. Save payload
    await editHeaderData(finalHeroUrl, finalPortraitUrl, bio);
    
    alert("Successfully edited header!");
    setVisible(false);
  } catch (error) {
    alert(`Error editing header data: ${error}`);
    console.error(error);
  } finally {
    setLoading(false);
  }
};



  // console.log(headerData);
  return (
    <form onSubmit={handleEditHeaderData}>
      <Fieldset.Root>
        <Stack>
          <Field.Root>
            <FieldLabel>Hero Photo</FieldLabel>
            <Input name="heroPhoto" defaultValue={headerData.hero_image} />
            <div className="flex w-full justify-end">
              <IconButton
                onClick={() => inputFileRefHI.current?.click()}
                variant={"ghost"}
                className="rounded-full"
                p={1}
              >
                <MdOutlineFileUpload />
                <Input
                  hidden
                  onChange={(e) => handleFileSelect(e, setHeroImageName)}
                  id="portraitFileUpload"
                  ref={inputFileRefHI}
                  type="file"
                  accept="image/*"
                />
              </IconButton>
              <Text fontSize={16}>{heroImageName}</Text>
            </div>
          </Field.Root>
          <Field.Root>
            <FieldLabel>Portrait</FieldLabel>
            <Input name="portrait" defaultValue={headerData.portrait} />
            <div className="flex w-full justify-end">
              <IconButton
                onClick={() => inputFileRefP.current?.click()}
                variant={"ghost"}
                className="rounded-full"
                p={1}
              >
                <MdOutlineFileUpload />
                <Input
                  hidden
                  onChange={(e) => handleFileSelect(e, setPortraitFileName)}
                  id="portraitFileUpload"
                  ref={inputFileRefP}
                  type="file"
                  accept="image/*"
                />
              </IconButton>
              <Text fontSize={16}>{portraitFileName}</Text>
            </div>
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
          variant={"plain"}
          // bg={"#828698"}
          _hover={{ textDecoration: "underline" }}
          size={"lg"}
          fontSize={20}
          loading={loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
