import {
    Button,
    MultiSelect,
    NumberInput,
    Select,
    TextInput,
} from "@mantine/core";
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

// todo: make splits per user editable
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
            <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => {
                    return (
                        <TextInput
                            label="Expense Name"
                            mb="md"
                            placeholder="Choose an expense name"
                            error={errors.name ? errors.name.message : false}
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
                            placeholder="Select category..."
                            value={value}
                            mb="md"
                            onChange={onChange}
                            searchable
                            data={["food", "no category"]}
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
                            label="Select Amount"
                            mb="md"
                            defaultValue={0.05}
                            precision={2}
                            value={value}
                            onChange={onChange}
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
                            placeholder="Select currency..."
                            value={value}
                            onChange={onChange}
                            mb="md"
                            searchable
                            data={["EUR", "USD", "GBP", "YEN"]}
                        />
                    );
                }}
            />
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
                            required
                            mb="md"
                        />
                    );
                }}
            />
            <Button loading={isSubmitting} type="submit">
                {isEdit ? "Edit" : "Create"}
            </Button>
        </form>
    );
};

export default ExpenseForm;
