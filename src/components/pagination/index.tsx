import { Button, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { ITEMS_PER_PAGE } from "../../helpers";

interface PaginationProps {
    total: number;
    handlePageUpdate: (skip: number, limit: number) => void;
}

const Pagination = ({ total, handlePageUpdate }: PaginationProps) => {
    const [page, setPage] = useState<number>(1);
    const [pageQty, setPageQty] = useState<number>(0);

    useEffect(() => {
        const computedPageQty: number = Math.floor(total / ITEMS_PER_PAGE) + (total % ITEMS_PER_PAGE !== 0 ? 1 : 0);
        setPageQty(computedPageQty);
    }, [total]);

    useEffect(() => {
        const skip: number = ITEMS_PER_PAGE * (page - 1);
        handlePageUpdate(skip, ITEMS_PER_PAGE);
    }, [page, handlePageUpdate]);

    const handleChange = (event: any | undefined, newPage: number) => {
        event?.stopPropagation();
        if (typeof newPage === 'number' && newPage > 0 && newPage <= pageQty) {
            setPage(newPage);
        }
    };

    if (total > ITEMS_PER_PAGE) {
        return (
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <Button
                    variant={'contained'}
                    disabled={page === 1}
                    onClick={(event: any) => handleChange(event, page - 1)}
                >
                    <ArrowBackIosIcon />
                </Button>
                <Typography variant={'h6'}>
                    <TextField
                        id={`pagination-page`}
                        value={page}
                        onChange={({ target: { value } }) => handleChange(undefined, +value)}
                        variant={"standard"}
                        sx={{ width: "33px" }}
                    /> / {pageQty}
                </Typography>
                <Button
                    variant={'contained'}
                    disabled={page === pageQty}
                    onClick={(event: any) => handleChange(event, page + 1)}
                >
                    <ArrowForwardIosIcon />
                </Button>
            </Stack>
        );
    } else {
        return null;
    }
};

export default Pagination;