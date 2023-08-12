import {
    Group,
    Title,
    Paper,
    Button,
    UnstyledButton,
    Modal,
} from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { displayCurrency } from "../../utils/functions/functions";
import UserPreview from "../../components/User/UserPreview";
import { useGetOneQuery } from "../../api/GenericCalls/useGetOneQuery";
import { apiEndPoints } from "../../utils/constants/constants";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { Transaction } from "../../types/transactions";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDeleteMutation } from "../../api/GenericCalls/useDeleteMutation";
import { useState } from "react";

const ExpensePage = () => {
    const { expenseId, id } = useParams<{ expenseId: string; id: string }>();

    const { data, status } = useGetOneQuery<Transaction>({
        url: apiEndPoints.transaction.getTransaction(expenseId || ""),
        id: expenseId || "",
        invalidationProperty: "transaction",
    });

    const { deleteMutation } = useDeleteMutation({
        entityName: "Transaktion",
        invalidationProperty: "transaction",
        navigationPathOnSuccess: `/groups/${id}/expenses`,
    });

    const [open, setOpen] = useState(false);

    function deleteProject() {
        deleteMutation.mutate(
            apiEndPoints.transaction.deleteTransaction(expenseId || "")
        );
    }

    console.log(data);

    return (
        <LoadingComponent status={status}>
            <Modal
                title="Projekt löschen"
                opened={open}
                onClose={() => setOpen(false)}
                centered
            >
                <p>Wollen Sie die Transaktion wirklich löschen?</p>
                <Button
                    fullWidth
                    mb="md"
                    onClick={() => setOpen(false)}
                    variant="outline"
                    color="gray"
                >
                    Abbrechen
                </Button>
                <Button fullWidth color="red" onClick={() => deleteProject()}>
                    Löschen
                </Button>
            </Modal>
            <Link to={`/groups/${id}/expenses`}>
                <UnstyledButton>Übersicht</UnstyledButton>
            </Link>
            <Group mb="md" position="apart">
                <Title>{data?.description}</Title>
                <Group>
                    <Link to={`/groups/${id}/expenses/${expenseId}/edit`}>
                        <Button
                            leftIcon={<IconEdit size={20} />}
                            variant="outline"
                            size="sm"
                        >
                            Bearbeiten
                        </Button>
                    </Link>
                    <Button
                        onClick={() => setOpen(true)}
                        variant="outline"
                        size="sm"
                        leftIcon={<IconTrash size={20} />}
                        color="red"
                    >
                        Löschen
                    </Button>
                </Group>
            </Group>

            <Paper withBorder p="sm" mb="md" radius="md">
                <Group position="apart" mb="md">
                    <Title order={3}>Amount</Title>
                    <Title order={3}>
                        {displayCurrency(data?.amount || 0, "EUR")}
                    </Title>
                </Group>
                <Group position="apart">
                    <Title order={3}>Curency</Title>
                    <Title order={3}>EUR</Title>
                </Group>
            </Paper>

            <Paper withBorder p="sm" mb="md" radius="md">
                <Group position="apart" mb="md">
                    <Title order={3}>Sender</Title>
                    <UserPreview
                        user={{
                            name: data?.senderUsername || "",
                            id: (data?.senderUsername as any) || "",
                        }}
                        link={`/groups/${id}/users/${
                            data?.receiverUsername || ""
                        }`}
                    />
                </Group>
                <Group position="apart">
                    <Title mb="md" order={3}>
                        Empfänger
                    </Title>
                    <UserPreview
                        user={{
                            name: data?.receiverUsername || "",
                            id: (data?.receiverUsername as any) || "",
                        }}
                        link={`/groups/${id}/users/${
                            data?.receiverUsername || ""
                        }`}
                    />
                </Group>
            </Paper>

            <Paper withBorder p="sm" mb="md" radius="md">
                <Group position="apart">
                    <Title order={3}>Erstellt am</Title>
                    <Title order={4}>
                        {dayjs(data?.createdAt).format("DD.MM.YYYY")}
                    </Title>
                </Group>
            </Paper>
        </LoadingComponent>
    );
};
export default ExpensePage;
