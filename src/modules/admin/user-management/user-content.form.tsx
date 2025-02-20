/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useCreateUser from "./hooks/useCreateUser";
import UserForm from "./user-form";


const userSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First Name must be at least 2 characters.",
    })
    .max(30, {
      message: "First Name must not be longer than 30 characters.",
    }),
    lastName: z
    .string()
    .min(2, {
      message: "Last Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Last Name must not be longer than 30 characters.",
    }),
    middleName: z
    .string()
    .optional(),
    
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
    userImg:  z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, `File size should be less than 5MB.`)
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      "Only .jpg, .png, and .webp files are accepted."
    )
    .optional(),
  password: z
    .string({
      required_error: "This field is required.",
    })
    .min(2, {
      message: "Password must be at least 2 characters.",
    })
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    }),
  userRole: z.string({
      required_error: "This field is required.",
    }),
    userLocation: z.string({
      required_error: "This field is required.",
    })  
})

const defaultValues = {
  firstName: "",
  lastName: "",
  middleName: "",
  userImg: undefined,
  password: "",
  email: "",
  userRole: "",
  userLocation: ""
}

export type UserFormValues = z.infer<typeof userSchema>;


const UserContentForm = () => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: "onTouched",
    defaultValues: defaultValues
  });


  const { isAddingUser, addUserHandler } = useCreateUser()


  const [isOpen, setIsOpen] = useState<boolean>(false);


  const resetForm = () => {
    form.reset(defaultValues);
  };

   
  const onSubmit: SubmitHandler<UserFormValues | any> =  async (data: UserFormValues) => {
    try {

      const { firstName, lastName, middleName, userRole, userLocation, userImg, password, email } = data;
      const userData = {
        firstName,
        lastName,middleName,email,password,userImg,userRole, municipal_id: userLocation,
        confirmPassword: data.password,
      }

      

      console.log(userData)
      await addUserHandler(userData)
      
      resetForm();
      setIsOpen(false)
      
       

      console.log(form.getValues())
    
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`)
    } 


  }
  
  return (
      <Sheet onOpenChange={setIsOpen} open={isOpen}>
          <SheetTrigger asChild>
            <Button
            className="h-8 gap-1 bg-[#0B0400]"
            size="sm"
            variant={"gooeyLeft"}
            onClick={() => setIsOpen(true)}
            >
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add User
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent className=" p-0 flex flex-col h-full md:max-w-[40rem]">
              <header
                className={`py-4 bg-overlay-bg
              border-b border-overlay-border px-6 bg-overlay-bg border-b border-overlay-border flex-shrink-0`}
              >
                <div>
                  <h3 className="text-lg font-medium">Adding User</h3>
                  <p className="text-xs text-muted-foreground">
                    Fill in the details.
                  </p>
                </div>
              </header>
              <div className="flex-grow overflow-y-auto">
                <UserForm form={form} />
              </div>
            <SheetFooter className="flex-shrink-0 px-6 py-4 bg-overlay-bg border-t border-overlay-border">
              <Button type="submit" disabled={isAddingUser} onClick={form.handleSubmit(onSubmit)} >
                {isAddingUser ? "Creating User..." : "Create User"}
                  {/* Add User */}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
  )
}


export default UserContentForm


