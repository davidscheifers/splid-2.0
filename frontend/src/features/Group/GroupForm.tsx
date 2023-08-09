import { Button, Paper, Select, TextInput } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { GroupFormSchema, TGroupForm } from "../../types/group";

type GroupFormProps = {
    /* form submit handler */
    onSubmit: SubmitHandler<TGroupForm>;

    /* optional initial form values */
    defaultValues?: TGroupForm;

    /* optional loading state */
    isSubmitting?: boolean;
};

const GroupForm = ({
    onSubmit,
    defaultValues,
    isSubmitting,
}: GroupFormProps) => {
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<TGroupForm>({
        defaultValues,
        resolver: zodResolver(GroupFormSchema),
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
                                placeholder="Choose an expense name"
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
                <Controller
                    name="currency"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <Select
                                label="Category"
                                placeholder="Select category..."
                                value={value}
                                mb="md"
                                onChange={onChange}
                                searchable
                                data={["EUR", "USD", "GBP", "YEN"]}
                                required
                            />
                        );
                    }}
                />
            </Paper>
            <Button fullWidth loading={isSubmitting} type="submit">
                {isEdit ? "Edit" : "Create"}
            </Button>
        </form>
    );
};

export default GroupForm;