import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../helpers";

const LanguageSelector = () => {
    const { t: translate, i18n } = useTranslation();

    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language)
    };

    return (
        <TextField
            id="select"
            label={translate("language")}
            value={i18n.resolvedLanguage}
            select
            onChange={({ target: { value } }) => handleLanguageChange(value)}
            sx={{
                width: "fit-content",
                height: "100%"
            }}
            SelectProps={{
                native: true,
                inputProps: {
                    "data-testid": "language-selector"
                }
            }}
        >
            {
                LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>
                        {translate(`languages.${lang}`)}
                    </option>
                ))
            }
        </TextField>
    );
};

export default LanguageSelector;