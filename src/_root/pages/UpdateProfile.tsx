import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { useUpdateUserDetails } from "@/lib/react-query/queriesAndMutations";
import { ProfileValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const UpdateProfile = () => {
  const { user: userData, setUser } = useUserContext();
  const { mutate: updateUserDetails } = useUpdateUserDetails();
  // const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      imageUrl: userData?.imageUrl || "",
      name: userData?.name || "",
      username: userData?.username || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    console.log(values);

    setUser((prevUser) => ({
      ...prevUser,
      name: values.name,
      username: values.username,
      email: values.email,
      bio: values.bio || "",
      imageUrl: values.imageUrl || "",
    }));

    updateUserDetails({
      userId: userData.id,
      name: values.name,
      username: values.username,
      email: values.email,
      bio: values.bio || "",
      imageUrl: values.imageUrl || "",
    });

    navigate(`/profile/${userData.id}`);
  }

  if (!userData) {
    return <Loader />;
  }

  // const handleProfilePictureChange = () => {
  //   // Trigger click event on file input
  //   fileInputRef.current.click();
  // };

  return (
    <Form {...form}>
      <div className="flex flex-col justify-center flex-1 w-full px-5 py-10 overflow-scroll md:p-14 custom-scrollbar ">
        <div className="flex gap-4 mt-20">
          <img
            src={"/assets/icons/edit.svg"}
            alt="share"
            width={30}
            height={30}
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <h2 className="w-full h3-bold md:h2-bold">Edit Profile</h2>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={userData.imageUrl}
            alt="Profile Pic"
            className="shrink-0 max-w-full aspect-square w-[100px] rounded-full"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              {...form.register("imageUrl")}
              // ref={fileInputRef}
              className="hidden"
            />
            {/* <Button className="my-auto" onClick={handleProfilePictureChange}>
              Change Profile Picture
            </Button> */}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col w-[60%] justify-center mt-10 text-lg font-semibold leading-6 text-zinc-100">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full gap-3"
            >
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" className="shad-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input type="text" className="shad-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" className="shad-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <textarea
                          className="text-sm shad-textarea"
                          rows={4}
                          {...field}
                        ></textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="shad-button_primary">
                Update Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default UpdateProfile;
