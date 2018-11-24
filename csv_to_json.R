# literature CSV to JSON
library(readr)
library(tidyverse)
library(stringr)
library(jsonlite)

melanoma_img <- read_delim("ISIC-2017_Training_Part3_GroundTruth.csv",
",", col_names = TRUE,
trim_ws = TRUE)

melanoma_img_simple <- melanoma_img %>% 
  transmute(image_id, ans = case_when(melanoma == 1 ~ 'mel',
                                      seborrheic_keratosis == 1 ~ 'seb',
                                      TRUE ~ 'nev'))


# save individual files
lit_times_path <- 'docs/times/'
save_json <- function(df) {
  cat(toJSON(df, pretty = TRUE), file = paste0(lit_times_path, sub(':', '_', df$time[1]), ".json"))
}

cat(toJSON(melanoma_img_simple, dataframe = 'rows', pretty = TRUE), file = 'docs/imgs.json')
