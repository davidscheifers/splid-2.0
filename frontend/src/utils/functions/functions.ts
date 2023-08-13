import { CurrencyType } from "../../types/group";

/**
 * Returns an object of grouped elements by a given key
 * @param {Array} arr - Array to group
 * @param {string} category - Key of the array to group by
 * @returns Returns an object of grouped elements by a given key
 * @example ...
 */
export function groupBy(arr: Array<any>, category: string) {
    return arr.reduce((acc, obj) => {
        let key = obj[category];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

export function displayCurrency(
    amount: number,
    currency: CurrencyType
): string {
    switch (currency) {
        case "EUR":
            return `${amount.toFixed(2)} €`;
        case "USD":
            return `${amount.toFixed(2)} $`;

        default:
            return `${amount.toFixed(2)}`;
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
export function removeElementFromArray<T, K extends keyof T>(
    value: any,
    arr: T[],
    key: K
) {
    let clonedArray = [...arr];

    const removeItemIndex = clonedArray.findIndex(
        (item) => item[key] === value
    );

    clonedArray.splice(removeItemIndex, 1);

    return clonedArray;
}

export function addElementToArray<T, K extends keyof T>(
    obj: T,
    arr: T[],
    findKey: K
) {
    let clonedArray = [...arr];

    const existingElement = clonedArray.find(
        (item) => item[findKey] === obj[findKey]
    );

    if (existingElement) {
        // if user already exists, return the input array without adding the user
        return arr;
    }

    const isFirstItem = clonedArray.length === 0;

    const highestId = Math.max(
        ...clonedArray.map((item: any) => item["id"] as number)
    );

    clonedArray.push({
        id: isFirstItem ? 1 : highestId + 1,
        ...obj,
    });

    return clonedArray;
}

export function generateRandomCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";

    for (let i = 0; i < 3; i++) {
        let part = "";
        for (let j = 0; j < 3; j++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            part += characters[randomIndex];
        }
        code += (i === 0 ? "" : " ") + part;
    }

    return code;
}

export function getFirstCharacterFromString(str: string): string {
    return str.charAt(0).toUpperCase();
}
