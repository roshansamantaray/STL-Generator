import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import Mustache from "mustache";

type Props = {
  dynamicFormInputs: {
    title: string;
    prompt: string;
    dynamicInputs: string[] | null;
  };
  onOpen: Boolean;
  onClose: (value: Boolean) => void;
  promptSubmitHandler: (
    prompt: string,
    prompt_title: string,
    keywords: any
  ) => void;
};

//Main render function
function PromptDialogue({
  onOpen,
  onClose,
  dynamicFormInputs,
  promptSubmitHandler,
}: Props) {
  //Dialogue close handler
  const closeHandler = () => {
    onClose(!onOpen);
    reset();
  };

  //form init values
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  //form submit handler
  const onSubmit = (data: any) => {
    const output = Mustache.render(dynamicFormInputs.prompt, data);

    promptSubmitHandler(output, dynamicFormInputs.title, data);
    reset();
    closeHandler();
  };

  return (
    <div
      className={`bg-white absolute bottom-32 max-sm:bottom-40 p-6 min-w-[40vh] rounded-md transition-all duration-500 max-sm:z-50
 ${!onOpen ? "opacity-0" : "opacity-100"}`}
    >
      <h1 className="text-black text-2xl font-bold">
        Please fill the following details!
      </h1>
      <h1 className="text-black font-bold mt-3">
        Q. {dynamicFormInputs?.title}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {dynamicFormInputs?.dynamicInputs?.map((item, index) => (
            <div className="my-4" key={index}>
              <p className="text-black font-semibold mb-1">Enter {item}</p>
              <Input
                className="text-primary-foreground bg-primary"
                id={item}
                {...register(`${item}`, { required: true })}
              />
              {errors[item] && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertCircle size={15} color="red" />
                  <p className="text-right  text-red-600 ">
                    {item} cannot be blank
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex w-full justify-end mt-4 gap-4">
          <Button
            type="button"
            className="text-black"
            onClick={closeHandler}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit" variant="secondary">Done</Button>
        </div>
      </form>
    </div>
  );
}

export default PromptDialogue;
