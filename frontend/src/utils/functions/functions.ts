import { CurrencyType } from "../../types/group";

export function displayCurrency(
    amount: number,
    currency: CurrencyType
): string {
    switch (currency) {
        case "EUR":
            return `${amount} €`;
        case "USD":
            return `${amount} $`;

        default:
            return `${amount}`;
    }
}

export function filterDatasetByStringName<T, K extends keyof T>(
    dataset: T[],
    key: K,
    value: string
): T[] {
    return dataset.filter((item) => {
        if (value === "") return true;

        const i = item[key] as string;

        return i.toLowerCase().includes(value.toLowerCase());
    });
}

export function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

export function generateMailtoLink(
    recipient: string,
    subject?: string,
    body?: string
): string {
    let href = `mailto:${encodeURIComponent(recipient)}`;

    if (subject) {
        href += `?subject=${encodeURIComponent(subject)}`;
    }

    if (body) {
        href += `&body=${encodeURIComponent(body)}`;
    }

    return href;
}
