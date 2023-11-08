import axios from "axios";
import { UploadedFileMeta } from "../components/basic/FileUploader";
import { readFileAsBinaryString } from "./file.utils";

export type ZendeskAttachment = {
  content_type: string;
  content_url: string;
  deleted: boolean;
  file_name: string;
  height: string;
  id: number;
  inline: boolean;
  mapped_content_url: string;
  size: number;
  thumbnails: unknown[];
  url: string;
  width: string;
};

export const zendeskAttachmentUploadHandler = async (file: File) => {
  const binary = await readFileAsBinaryString(file);
  const url = `/api/utils/upload-zendesk-attachment?fileName=${file.name}`;
  const response = await axios.post<UploadedFileMeta>(url, binary, {
    headers: {
      "Content-Type": "application/binary",
    },
  });
  return response.data;
};
