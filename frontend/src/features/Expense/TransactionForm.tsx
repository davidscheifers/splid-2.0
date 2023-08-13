import {
    Button,
    NumberInput,
    Paper,
    Select,
    TextInput,
    Title,
} from "@mantine/core";
import { ExpenseFormSchema, TExpenseForm } from "../../types/expenses";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetOneQuery } from "../../api/GenericCalls/useGetOneQuery";
import Balance from "../../routes/balance/balance";
import { apiEndPoints } from "../../utils/constants/constants";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

type TransactionFormProps = {
    /* form submit handler */
    onSubmit: SubmitHandler<TExpenseForm>;

    /* optional initial form values */
    defaultValues?: TExpenseForm;

    /* optional loading state */
    isSubmitting?: boolean;

    /* mandatory group id */
    groupId: string;
};

const TransactionForm = ({
    onSubmit,
    defaultValues,
    isSubmitting,
    groupId,
}: TransactionFormProps) => {
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

    const { data, status } = useGetOneQuery<Balance[]>({
        url: apiEndPoints.accounting.getAccountingInformationsFromGroup(
            groupId
        ),
        id: groupId,
        invalidationProperty: "goupAccounting",
    });

    const mappedUsers = data?.map((balance) => balance.username) || [];

    const isEdit = defaultValues !== undefined;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <LoadingComponent status={status}>
                <Title order={3}>Informationen</Title>
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
                                <Select
                                    label="Sender"
                                    placeholder="Wählen sie den Sender"
                                    mb="md"
                                    error={
                                        errors.senderUsername
                                            ? errors.senderUsername.message
                                            : false
                                    }
                                    onChange={onChange}
                                    value={value}
                                    data={mappedUsers}
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
                                <Select
                                    label="Empfänger"
                                    placeholder="Geben sie den Empfänger"
                                    mb="md"
                                    error={
                                        errors.senderUsername
                                            ? errors.senderUsername.message
                                            : false
                                    }
                                    onChange={onChange}
                                    value={value}
                                    data={mappedUsers}
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
                    {isEdit ? "Bearbeiten" : "Erstellen"}
                </Button>
            </LoadingComponent>
        </form>
    );
};

export default TransactionForm;
