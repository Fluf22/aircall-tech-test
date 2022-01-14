import { Grid, Button, TextField, Typography } from "@mui/material";
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
    const [currentPage, setCurrentPage] = useState<string>("1");

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
        let updatedPage: number;
        if (typeof newPage !== 'number' || newPage <= 0) {
            updatedPage = 1;
        } else if (newPage >= pageQty) {
            updatedPage = pageQty;
        } else {
            updatedPage = newPage;
        }
        setPage(updatedPage);
        setCurrentPage("" + updatedPage);
    };

    const handleCurrentPageChange = (event: any | undefined, newPage: string) => {
        event?.stopPropagation();
        setCurrentPage(newPage)
    };

    const handleInput = (event: any) => {
        if (event.key === "Enter") {
            event.stopPropagation();
            handleChange(undefined, +currentPage);
        }
    };

    if (total > ITEMS_PER_PAGE) {
        return (
            <Grid container justifyContent={"space-between"} alignItems={"center"} my={2}>
                <Grid item>
                    <Button
                        variant={"contained"}
                        disabled={page === 1}
                        onClick={(event: any) => handleChange(event, page - 1)}
                        aria-label="previous page"
                        sx={{
                            pl: "24px"
                        }}
                    >
                        <ArrowBackIosIcon />
                    </Button>
                </Grid>
                <Grid item>
                    <Typography variant={"h6"}>
                        <TextField
                            id={"pagination-page"}
                            value={currentPage}
                            onChange={({ target: { value } }) => handleCurrentPageChange(undefined, value)}
                            onKeyUp={(event) => handleInput(event)}
                            variant={"standard"}
                            sx={{ width: "33px" }}
                            inputProps={{
                                "aria-label": "current page"
                            }}
                        /> / {pageQty}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant={"contained"}
                        disabled={page === pageQty}
                        onClick={(event: any) => handleChange(event, page + 1)}
                        aria-label="next page"
                    >
                        <ArrowForwardIosIcon />
                    </Button>
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
};

export default Pagination;