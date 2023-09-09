import {
    Box,
    Button,
    Divider,
    Group,
    NumberInput,
    Paper,
    Select,
    TextInput,
    Text,
    Title,
} from "@mantine/core";
import { ExpenseFormSchema, TExpenseForm } from "../../types/expenses";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetOneQuery } from "../../api/GenericCalls/useGetOneQuery";
import Balance from "../../routes/balance/balance";
import { apiEndPoints } from "../../utils/constants/constants";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useState } from "react";
import UserPreview from "../../components/User/UserPreview";
import { displayCurrency } from "../../utils/functions/functions";

type ExpenseFormProps = {
    /* form submit handler */
    onSubmit: (
        data: TExpenseForm,
        receiverPercentage: number,
        senderPercentage: number
    ) => void;

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
        watch,
    } = useForm<TExpenseForm>({
        defaultValues: {
            ...defaultValues,
            groupId,
        },
        resolver: zodResolver(ExpenseFormSchema),
    });
    const [senderPercentage, setSenderPercentage] = useState(50);
    const [receiverPercentage, setReceiverPercentage] = useState(50);

    const matchingAmount = senderPercentage + receiverPercentage === 100;

    const { data, status } = useGetOneQuery<Balance[]>({
        url: apiEndPoints.accounting.getAccountingInformationsFromGroup(
            groupId
        ),
        id: groupId,
        invalidationProperty: "goupAccounting",
    });

    const mappedUsers = data?.map((balance) => balance.username) || [];

    const isEdit = defaultValues !== undefined;

    const sender = watch("senderUsername");
    const receiver = watch("receiverUsername");
    const amount = watch("amount");

    return (
        <form
            onSubmit={handleSubmit((data) =>
                onSubmit(data, receiverPercentage, senderPercentage)
            )}
        >
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

                {sender && receiver && (
                    <Box>
                        <Title order={3}>Verteilung</Title>
                        <Paper withBorder p="sm" mb="md" radius="md">
                            <Group mb="md" position="apart">
                                <Group>
                                    <UserPreview
                                        user={{ name: sender, id: sender }}
                                    />
                                    <Text>
                                        {displayCurrency(
                                            (senderPercentage / 100) * amount ||
                                                0,
                                            "EUR"
                                        )}
                                    </Text>
                                </Group>
                                <NumberInput
                                    value={senderPercentage}
                                    onChange={(e) => setSenderPercentage(e)}
                                />
                            </Group>
                            <Group mb="md" position="apart">
                                <Group>
                                    <UserPreview
                                        user={{ name: receiver, id: receiver }}
                                    />
                                    <Text>
                                        {displayCurrency(
                                            (receiverPercentage / 100) *
                                                amount || 0,
                                            "EUR"
                                        )}
                                    </Text>
                                </Group>
                                <NumberInput
                                    value={receiverPercentage}
                                    onChange={(e) => setReceiverPercentage(e)}
                                />
                            </Group>
                            <Divider mb="md" />
                            {!matchingAmount && (
                                <Text>
                                    Gesamtprozentanzahl muss 100 ergeben!
                                </Text>
                            )}
                        </Paper>
                    </Box>
                )}

                {matchingAmount && (
                    <Button fullWidth loading={isSubmitting} type="submit">
                        {isEdit ? "Bearbeiten" : "Erstellen"}
                    </Button>
                )}
            </LoadingComponent>
        </form>
    );
};

export default ExpenseForm;
