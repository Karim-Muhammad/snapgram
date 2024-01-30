import { useState, useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

interface UploaderFileProps {
  fieldChange: (FILES: FileWithPath[]) => void;
  imageUrl?: string;
}

const UploaderFile = (props: UploaderFileProps) => {
  // States
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");

  // Event onDrop
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      setFiles(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      props.fieldChange(acceptedFiles);
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".svg", ".png", ".jpg", ".jpeg"],
    },
  });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />

      {fileUrl ? (
        <>
          <div className="flex flex-1 flex-center">
            <img src={fileUrl} alt="uploaded-image" />
          </div>
          <h3 className="text-light-4 mt-2 font-bold text-xs text-center">
            Drag another image to replace
          </h3>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src={
              props.imageUrl ? props.imageUrl : "/assets/icons/file-upload.svg"
            }
            {...(!props.imageUrl && {
              width: 96,
              height: 77,
            })}
            className="object-cover w-full h-full"
            alt="file-upload-image"
          />

          <h3 className="font-bold text-sm md:text-lg text-center">
            Drag & Drop Your File Here
          </h3>
          <p className="text-light-4 small-regular">JPG, PNG, SVG</p>
        </div>
      )}
    </div>
  );
};

export default UploaderFile;
