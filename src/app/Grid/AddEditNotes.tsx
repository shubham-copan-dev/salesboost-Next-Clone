/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Box, Button, Modal, Spinner, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { note } from "@/axios/actions/note";
import CustomConfirmAlert from "@/components/UI/ConfirmAlert";
import {
  EditorField,
  InputField,
  TextareaField,
} from "@/components/formFields";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  deleteNote,
  pushToNotes,
  setNotes,
  updateNote,
} from "@/redux/slices/note";
import { NoteInterface } from "@/redux/slices/note/interface";
import { RecordsInterface } from "@/redux/slices/salesForce/interface";

import "./notes.css";
import { useParams } from "next/navigation";

// const ReactEditorJS = createReactEditorJS();

function AddEditNotes(props: { show: boolean; handleClose: () => void }) {
  //   use hooks
  const { tabId } = useParams();
  const dispatch = useAppDispatch();
  const toast = useToast();
  // global states
  const { notes } = useAppSelector((state) => state.note);

  // local states
  const [selectedNote, setSelectedNote] = useState<NoteInterface | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [addingNew, setAddingNew] = useState<boolean>(false);

  // hook form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<any>({
    shouldUnregister: true,
  });

  // onsubmit handler
  const onSubmit = async (formData: RecordsInterface) => {
    try {
      if (selectedNote) {
        await note({
          method: "PATCH",
          url: `sf/object/view/${selectedNote?._id}`,
          data: formData,
        });
        dispatch(updateNote({ ...selectedNote, ...formData }));
      } else if (addingNew) {
        const resp = await note({
          method: "POST",
          url: `sf/object/${tabId}/view/notes`,
          data: formData,
        });
        setAddingNew(false);
        dispatch(pushToNotes(resp?.data?.data));
        setSelectedNote(resp?.data?.data);
        setValue("heading", resp?.data?.data?.heading);
        setValue("description", resp?.data?.data?.description);
        setValue("content", resp?.data?.data?.content);
      }
      // toast({
      //   status: `Note ${selectedNote ? "updated" : "added"} successfully`,
      // });
      // props.handleClose();
    } catch (error) {
      console.log(error, "error");
    }
  };

  // handling note delete
  const handleDelete = async () => {
    await note({
      method: "DELETE",
      url: `sf/object/view/${selectedNote?._id}`,
    });
    dispatch(deleteNote(selectedNote?._id));
    // toast(`Note deleted successfully`);
  };

  // handling add new note
  const handleAddNewNote = () => {
    setValue("heading", "");
    setValue("description", "");
    setValue("content", "");
    setSelectedNote(null);
    setAddingNew(true);
  };

  // handling discard new note
  const handlingDiscardNewNote = () => {
    if (notes?.length) {
      setAddingNew(false);
      setSelectedNote(notes?.[0]);
      setValue("heading", notes?.[0]?.heading);
      setValue("description", notes?.[0]?.description);
      setValue("content", notes?.[0]?.content);
    }
  };

  // fetching initial notes
  useEffect(() => {
    note({
      method: "GET",
      url: `sf/object/view/public`,
    }).then((resp) => {
      dispatch(setNotes(resp?.data?.data));
      if (resp?.data?.data?.length) {
        setSelectedNote(resp?.data?.data?.[0]);
        setValue("heading", resp?.data?.data?.[0]?.heading);
        setValue("description", resp?.data?.data?.[0]?.description);
        setValue("content", resp?.data?.data?.[0]?.content);
      }
    });
  }, []);

  return <Box>work in progress</Box>;
}

export default AddEditNotes;
