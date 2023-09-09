import { Button, Paper, TextInput } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUserForm, UserFormSchema } from "../../types/user";

type ExpenseFormProps = {
    /* form submit handler */
    onSubmit: SubmitHandler<TUserForm>;

    /* optional initial form values */
    defaultValues?: TUserForm;

    /* optional loading state */
    isSubmitting?: boolean;
};

const UserForm = ({
    onSubmit,
    defaultValues,
    isSubmitting,
}: ExpenseFormProps) => {
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<TUserForm>({
        defaultValues,
        resolver: zodResolver(UserFormSchema),
    });

    const isEdit = defaultValues !== undefined;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Paper withBorder p="sm" mb="md" radius="md">
                <Controller
                    name="name"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <TextInput
                                label="Name"
                                mb="md"
                                placeholder="Name eingeben"
                                error={
                                    errors.name ? errors.name.message : false
                                }
                                onChange={onChange}
                                value={value}
                                required
                            />
                        );
                    }}
                />
            </Paper>
            <Button fullWidth loading={isSubmitting} type="submit">
                {isEdit ? "Bearbeiten" : "Erstellen"}
            </Button>
        </form>
    );
};

export default UserForm;
