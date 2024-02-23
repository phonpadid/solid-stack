import {
  FormError,
  SubmitHandler,
  createForm,
  setValue,
  setValues,
  valiForm,
} from "@modular-forms/solid";
import { useParams } from "@solidjs/router";
import { Show, createEffect, createResource, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import Avatar from "../../../components/avatar/Avatar";
import Button from "../../../components/button/Button";
import InputFile from "../../../components/forms/input-file/InputFile";
import InputText from "../../../components/forms/input-text/InputText";
import PasswordInput from "../../../components/forms/password-input/PasswordInput";
import Select from "../../../components/forms/select/Select";
import LoadingIcon from "../../../components/icons/LoadingIcon";
import TrashIcon from "../../../components/icons/TrashIcon";
import { useConfirm } from "../../../contexts/confirm/ConfirmContext";
import { fadeIn, fadeOut } from "../../../utils/transition-animation";
import getUserDetailApi from "./api/get-user-detail.api";
import { UserForm, UserSchema } from "./schemas/user.schema";

export default () => {
  const param = useParams();
  const confirm = useConfirm();

  const [id] = createSignal<string>(param.id);
  const [user] = createResource(id, getUserDetailApi);
  const [previewImg, setPreviewImg] = createSignal<string>("");

  const [userForm, { Form, Field }] = createForm<UserForm>({
    validate: valiForm(UserSchema),
    initialValues: {
      emailStatus: ["not-verified"],
      roles: [],
    },
  });

  createEffect(() => {
    if (user.state === "ready") {
      setValues(userForm, {
        firstName: user().data.firstName,
        lastName: user().data.lastName,
      });
      setPreviewImg(user().data.image);
    }
  });

  const handleSubmit: SubmitHandler<UserForm> = async (values) => {
    if (values.password !== values.confirmPassword) {
      throw new FormError<UserForm>({
        confirmPassword: "password dose not match",
      });
    }

    console.log(values);
  };

  return (
    <Form onSubmit={handleSubmit} class="relative">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Update user
      </h2>
      <div class="grid gap-4 mb-4 sm:mb-8 md:grid-cols-2 md:gap-6">
        <Field name="image" type="File">
          {(field, props) => (
            <InputFile
              label="Upload file"
              {...props}
              error={field.error}
              helpMessage="SVG, PNG, JPG or GIF (MAX. 800x400px)."
              previewImage={
                <Avatar
                  alt="preview"
                  class="mb-4 sm:mb-0 mr-4 "
                  size="lg"
                  src={previewImg()}
                />
              }
              onSelectFile={(files) => {
                setPreviewImg(URL.createObjectURL(files[0]));
                setValue(userForm, "image", files[0]);
              }}
            />
          )}
        </Field>

        <Field name="firstName">
          {(field, props) => (
            <InputText
              required
              label="First Name"
              {...props}
              value={field.value}
              error={field.error}
              placeholder="First Name"
            />
          )}
        </Field>
        <Field name="lastName">
          {(field, props) => (
            <InputText
              required
              label="Last Name"
              {...props}
              value={field.value}
              error={field.error}
              placeholder="Last Name"
            />
          )}
        </Field>

        <Field name="email">
          {(field, props) => (
            <InputText
              required
              label="Email"
              {...props}
              value={field.value}
              error={field.error}
              placeholder="name@company.com"
            />
          )}
        </Field>
        <Field name="emailStatus" type="string[]">
          {(field, props) => (
            <Select
              contentClass="w-44"
              onValueChange={({ value }) => {
                setValue(userForm, "emailStatus", value);
              }}
              label="Email Status"
              name={props.name}
              items={[
                { label: "Not Verified", value: "not-verified" },
                { label: "Verified", value: "verified" },
              ]}
              error={field.error}
              value={field.value}
            ></Select>
          )}
        </Field>

        <div class="sm:col-span-2">
          <Field name="roles" type="string[]">
            {(field, props) => (
              <Select
                placeholder="Select Roles"
                contentClass="w-44"
                multiple
                onValueChange={({ value }) => {
                  setValue(userForm, "roles", value);
                }}
                label="User Role"
                name={props.name}
                items={[
                  { label: "Admin", value: "1" },
                  { label: "Reader", value: "2" },
                  { label: "Editor", value: "3" },
                ]}
                error={field.error}
                value={field.value}
              ></Select>
            )}
          </Field>
        </div>

        <Field name="password">
          {(field, props) => (
            <PasswordInput
              required
              label="Password"
              {...props}
              value={field.value}
              error={field.error}
              placeholder="•••••••••"
            />
          )}
        </Field>
        <Field name="confirmPassword">
          {(field, props) => (
            <PasswordInput
              required
              label="Confirm password"
              {...props}
              value={field.value}
              error={field.error}
              placeholder="•••••••••"
            />
          )}
        </Field>
      </div>

      <div class="flex items-center">
        <Button type="submit" isLoading={userForm.submitting} class="mr-3">
          Update user
        </Button>
        <Button
          color="danger"
          outlined
          type="button"
          isLoading={userForm.submitting}
          prefixIcon={<TrashIcon />}
          onClick={() => {
            confirm?.showConfirm(
              "Are you sure you want to delete this item?",
              {
                onConfirm: async () => {},
              },
              <TrashIcon class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" />
            );
          }}
        >
          Delete
        </Button>
      </div>

      <Transition onEnter={fadeIn} onExit={fadeOut}>
        <Show when={user.loading}>
          <div
            class={`absolute z-10 top-0 left-0 bg-black/50 w-full h-full flex items-center justify-center`}
          >
            <div>
              <LoadingIcon class="animate-spin w-8 h-8" />
            </div>
          </div>
        </Show>
      </Transition>
    </Form>
  );
};
