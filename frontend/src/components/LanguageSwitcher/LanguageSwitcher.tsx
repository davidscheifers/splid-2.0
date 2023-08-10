import { useTranslation } from "react-i18next";

const lngs = [
    { name: "en", nativeName: "English" },
    { name: "de", nativeName: "Deutsch" },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    function handleLanguage(lng: string) {
        i18n.changeLanguage(lng);
    }

    return (
        <div>
            <div>
                {lngs.map(({ name, nativeName }) => (
                    <button
                        key={nativeName}
                        style={{
                            fontWeight:
                                i18n.resolvedLanguage === name
                                    ? "bold"
                                    : "normal",
                        }}
                        type="submit"
                        onClick={() => handleLanguage(name)}
                    >
                        {nativeName}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default LanguageSwitcher;
