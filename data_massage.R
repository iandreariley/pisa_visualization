#D3

setwd("Documents/Academic/Udacity/DataAnalystND/d3/final_project/")

pisa <- read.csv('pisa2012_working.csv', header = TRUE)
country_pop <- read.csv('country_population.tsv', header = TRUE)

pisa$wealth <- round(pisa$wealth)

#subsetting function for getting slice by wealth and country
subset_two_fields <- function(df, field1, field2, val1, val2) {
  return(subset(df, field1 == val1 & field2 == val2))
}

#Standard error.
se <- function(x) {
  if(length(x) < 1)
    return(Inf)
  else
    return(sd(x)/sqrt(length(x)))
}

#two-tailed t critical value given confidence and sample size.
t_crit <- function(confidence, n) {
  if(n < 2)
    return(Inf)
  else
    return(abs(qt((1-confidence)/2, (n-1))))
}

dup_states <- c("Massachusetts (USA)",
                "Perm(Russian Federation)",
                "Florida (USA)",
                "Connecticut (USA)")

# Get populations that do not duplicate (for example, florida is counted twice,
# once in the USA population, and once in the Florida column).
country_pop_no_dup <- country_pop[!(country_pop$country %in% c("Massachusetts (USA)",
                                                                  "Perm(Russian Federation)",
                                                                  "Florida (USA)",
                                                                  "Connecticut (USA)")),]

# Get the total population of all participants in the study. Approx 2 billion.
total_pop <- sum(as.numeric(country_pop_no_dup$population))

countries <- unique(unlist(pisa$country))
wealth_levels <- unique(unlist(pisa$wealth))
wealth_levels <- wealth_levels[!is.na(wealth_levels)]

mean_by_wealth_and_country <- read.table(header = T, text='
                                         country wealth math_score')

# Generate mean score by wealth bin and country for all points that have a 95%
# confidence interval less than 40 (approximately 1 year of schooling according
# to PISA).
for(i in levels(countries)) {
  for(j in 1:11) {
    sliced <- subset(pisa, country == i & wealth == wealth_levels[j])
    t <- t_crit(.95, nrow(sliced))
    std_error <- se(sliced$math_score)
    if(! is.infinite(t) & !is.infinite(std_error) & t * std_error < 20) {
      rows <- nrow(mean_by_wealth_and_country)
      mean_by_wealth_and_country[rows + 1, ] <- c(i,
                                                wealth_levels[j],
                                                mean(sliced$math_score))
    }
  }
}


#Create new population column
mean_by_wealth_and_country$population <-NA

#Add population
for(i in 1:nrow(mean_by_wealth_and_country)) {
  con <- mean_by_wealth_and_country[i, "country"]
  sliced <- subset(country_pop, country == con)
  mean_by_wealth_and_country[i, "population"] <- sliced[1, "population"]
}

#Add weight (scores weighted by total country population)
mean_by_wealth_and_country$weight <- mean_by_wealth_and_country$population /
  total_pop

#Manually set zero weight for "duplicate" states as a flag for processing in
#d3
for(i in 1:nrow(mean_by_wealth_and_country)) {
  if(mean_by_wealth_and_country[i, "country"] %in% dup_states) {
    mean_by_wealth_and_country[i, "weight"] <- 0
  }
}

#Calculate mean scores of each country
country_mean <- pisa[c("country", "math_score")]
country_mean <- aggregate(country_mean,
                         by = list(country_mean$country),
                         FUN = mean, na.rm = TRUE)

#country is changed to group.1, drop country and rename group.1
country_mean <- country_mean[,!(names(country_mean) %in% c("country"))]
colnames(country_mean)[1] <- "country"

#Add population to country_mean
for(i in 1:nrow(mean_by_wealth_and_country)) {
  con <- country_mean[i, "country"]
  sliced <- subset(country_pop, country == con)
  mean_by_wealth_and_country[i, "population"] <- sliced[1, "population"]
}

#Add country_mean column.
mean_by_wealth_and_country$country_mean <- NA

#Add mean values to country_mean column.
for(i in 1:nrow(mean_by_wealth_and_country)) {
  con <- mean_by_wealth_and_country[i, "country"]
  sliced <- subset(country_mean, country == con)
  mean_by_wealth_and_country[i, "country_mean"] <- sliced[1, "math_score"]
}

country_mean$weight <- NA
for(i in 1:nrow(country_mean)) {
  con <- country_mean[i, "country"]
  sliced <- subset(mean_by_wealth_and_country, country == con)
  country_mean[i, "weight"] <- sliced[1, "weight"]
}

# Calculate grand mean
grand_mean <- with(country_mean, sum(math_score * weight))

#TODO: The math in this code appears to be right. We need to figure out why the
#loop is adding only the final row that is calculated, and get it to not do that.
#Then we're golden :)
for(i in 1:11) {
  sliced <- mean_by_wealth_and_country[which(mean_by_wealth_and_country$wealth == wealth_levels[i]),]
  repped_countries <- unique(sliced$country)
  repped_df <- country_pop[which(country_pop$country %in% repped_countries),]
  cum_pop <- sum(as.numeric(repped_df$population))
  cum_weight <- cum_pop / sum(as.numeric(country_pop$population))
  print(cum_weight)
  if(cum_weight > .5) {
    rows <- nrow(mean_by_wealth_and_country)
    score <- sum(as.numeric(sliced$weight) * as.numeric(sliced$math_score) / cum_weight)
    print(score)
    mean_by_wealth_and_country[rows + 1, ] <- c(as.factor("mean"),
                                                wealth_levels[i],
                                                score,
                                                cum_pop,
                                                cum_weight,
                                                grand_mean)
    
  }
}

mean_by_wealth_and_country[mean_by_wealth_and_country$country == "1", "country"] <- "mean"

#Write file:
write.table(mean_by_wealth_and_country,
            "pisa_by_country_and_wealth_filtered.tsv",
            sep="\t", row.names=FALSE, col.names=TRUE)