import { Button, NumberInput, Paper, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { ExpenseFormSchema, TExpenseForm } from "../../types/expenses";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dummyUsers } from "../../utils/data/data";
import UserPreview from "../../components/User/UserPreview";
import { forwardRef } from "react";
import { TDummyUser } from "../../types/group";
import UserPercentageSelect from "../../components/User/UserPercentageSelect";

type ExpenseFormProps = {
    /* form submit handler */
    onSubmit: SubmitHandler<TExpenseForm>;

    /* optional initial form values */
    defaultValues?: TExpenseForm;

    /* optional loading state */
    isSubmitting?: boolean;
};

type SelectItemProps = {
    label: string;
    value: string;
    user: TDummyUser;
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
    ({ user, ...others }: SelectItemProps, ref) => (
        <div ref={ref} {...others}>
            <UserPreview user={user} />
        </div>
    )
);

const ExpenseForm = ({
    onSubmit,
    defaultValues,
    isSubmitting,
}: ExpenseFormProps) => {
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<TExpenseForm>({
        defaultValues,
        resolver: zodResolver(ExpenseFormSchema),
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
                    name="category"
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
                                data={["food", "no category"]}
                                required
                            />
                        );
                    }}
                />
            </Paper>
            <Paper withBorder p="sm" mb="md" radius="md">
                <Controller
                    name="amount"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <NumberInput
                                label="Amount"
                                mb="md"
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
                <Controller
                    name="currency"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <Select
                                label="Currency"
                                placeholder="Select currency..."
                                value={value}
                                onChange={onChange}
                                mb="md"
                                searchable
                                required
                                data={["EUR", "USD", "GBP", "YEN"]}
                            />
                        );
                    }}
                />
            </Paper>
            <Paper withBorder p="sm" mb="md" radius="md">
                <Controller
                    name="from"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <Select
                                placeholder="Select User..."
                                value={value}
                                label="From"
                                onChange={onChange}
                                itemComponent={SelectItem}
                                mb="md"
                                required
                                data={dummyUsers.map((user) => {
                                    return {
                                        user,
                                        value: user.id.toString(),
                                        label: user.name,
                                    };
                                })}
                            />
                        );
                    }}
                />
                <Controller
                    name="for"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <UserPercentageSelect
                                value={value}
                                onChange={onChange}
                            />
                        );
                    }}
                />
            </Paper>
            <Paper withBorder p="sm" mb="md" radius="md">
                <Controller
                    name="buyDate"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <DateInput
                                label="Buy Date"
                                value={value}
                                onChange={onChange}
                                required
                                placeholder="Select buy date..."
                                mb="md"
                            />
                        );
                    }}
                />
                <Controller
                    name="createdAt"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <DateInput
                                label="Created At"
                                value={value}
                                onChange={onChange}
                                placeholder="Select createdAt date..."
                                required
                                mb="md"
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
