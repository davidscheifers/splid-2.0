import { Button, NumberInput, Paper, Select, TextInput } from "@mantine/core";
import { ExpenseFormSchema, TExpenseForm } from "../../types/expenses";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ExpenseFormProps = {
    /* form submit handler */
    onSubmit: SubmitHandler<TExpenseForm>;

    /* optional initial form values */
    defaultValues?: TExpenseForm;

    /* optional loading state */
    isSubmitting?: boolean;

    /* mandatory group id */
    groupId: string;
};

const ExpenseForm = ({
    onSubmit,
    defaultValues,
    isSubmitting,
    groupId,
}: ExpenseFormProps) => {
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<TExpenseForm>({
        defaultValues: {
            ...defaultValues,
            groupId,
        },
        resolver: zodResolver(ExpenseFormSchema),
    });

    const isEdit = defaultValues !== undefined;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Paper withBorder p="sm" mb="md" radius="md">
                <Controller
                    name="description"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <TextInput
                                label="Beschreibung"
                                mb="md"
                                placeholder="Beschreiben sie die Transaktion..."
                                error={
                                    errors.description
                                        ? errors.description.message
                                        : false
                                }
                                onChange={onChange}
                                value={value}
                                required
                            />
                        );
                    }}
                />
                <Controller
                    name="senderUsername"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <TextInput
                                label="Sender"
                                placeholder="Geben sie den Sendernamen ein..."
                                mb="md"
                                error={
                                    errors.senderUsername
                                        ? errors.senderUsername.message
                                        : false
                                }
                                onChange={onChange}
                                value={value}
                                required
                            />
                        );
                    }}
                />
                <Controller
                    name="receiverUsername"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <TextInput
                                label="Empfänger"
                                placeholder="Geben sie den Empfängernamen ein..."
                                mb="md"
                                error={
                                    errors.senderUsername
                                        ? errors.senderUsername.message
                                        : false
                                }
                                onChange={onChange}
                                value={value}
                                required
                            />
                        );
                    }}
                />
                <Controller
                    name="amount"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <NumberInput
                                label="Betrag"
                                defaultValue={0}
                                precision={2}
                                value={value}
                                onChange={onChange}
                                required
                                min={0}
                                step={0.05}
                                max={100000}
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

export default ExpenseForm;
