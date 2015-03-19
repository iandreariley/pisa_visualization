# Visualization of the PISA dataset
#### by Ian Riley

## Process

The Pisa dataset is a large one. I noticed that it used a column for each question
on each questionare. I knew that I wouldn't be using all of these variables (there
are some 640 of them) so the first thing I did was look through the data and
determine which variables I was going to use, and make a smaller dataset.

The variable names, even with the aid of the data dictionary, are confusing. So it
was difficult to pick which columns to use for analysis. Specifically, I had trouble
finding a variable relating to the score, which is really the metric of interest
(that is, I and others want to know which variables correlate with score so that
we might discover what conditions make for strong education). After some searching
on the interenet, I found code on [this website][1] that used the mean of the
PV<subject><n> (e.g. PVMAT1) scores as the total score in that subject.

Each score seems to be comprised of 5 'Plausible Values', according to the dataset
and the accompanying dictionary (e.g. 'PVMAT1' stands for 'Plausible value 1 in
mathematics')

### Choosing Variables

As mentioned above there are hundreds of variables in the PISA dataset. My interest
was seeing which variables could predict good test scores, so I immediately excluded
questions from the test itself (as they are part of the test scores). I decided to
use the mean of scores for each major and minor subject (math, reading, science).
The variables I chose are:

#### Potential Predictor Values

- "CNT": Country code (3 character)
- "SUBNATIO": sub-region 7 digit code (3 digit country code + region id + stratum id)
- "ST04Q01": Gender
- "ST08Q01": Late for school
- "ST09Q01": Skipped School
- "ST115Q01": Skipped Class during school day
- "ST20Q01": Country of Birth (note: ~9,000 NAs)
- "ST21Q01": Age of arrival in <country of test> (note: ~45,000 NAs)
- "ESCS": Index of economic, social and cultural status (note: ~ 12,000 NAs)
- "ANXMAT": Mathematics anxiety
- "HOMEPOS": Home possessions (note: ~6,000 NAs)
- "WEALTH": Wealth (note range: [-6.65, 3.25], median: -.3, mean: -.337, ~ 6,000 NAs

#### Predicted Values

- "PV1MATH","Plausible value 1 in mathematics"
- "PV2MATH","Plausible value 2 in mathematics"
- "PV3MATH","Plausible value 3 in mathematics"
- "PV4MATH","Plausible value 4 in mathematics"
- "PV5MATH","Plausible value 5 in mathematics"
- "PV1READ","Plausible value 1 in reading"
- "PV2READ","Plausible value 2 in reading"
- "PV3READ","Plausible value 3 in reading"
- "PV4READ","Plausible value 4 in reading"
- "PV5READ","Plausible value 5 in reading"
- "PV1SCIE","Plausible value 1 in science"
- "PV2SCIE","Plausible value 2 in science"
- "PV3SCIE","Plausible value 3 in science"
- "PV4SCIE","Plausible value 4 in science"
- "PV5SCIE","Plausible value 5 in science"

### Shaping

I renamed the predictor variables to make them more reader friendly and aggregated
the 'PV' variables into three averaged (arithmetic mean) scores. The new shape of the
data was then:

##### Predictor values

- country
- region
- gender
- tardy
- absent_day
- absent_class
- birth_country
- immegration_age
- socio_economic_index
- math_anxiety
- home_possessions
- wealth

##### Predicted values

- math_score
- science_score
- reading_score

### Cleaning

Some issues arose during univariate analysis of the smaller dataset:

- In the 'country' variable, Massachusetts, Connecticut and Florida are listed as
  separate from the United States of America.
- I was curious about how immigration age affects the scores of all tests, however
  I found that about 98% of the values for this variable are NAs. I was not
  immediately sure whether to impute values, use only non NA values, or dump the
  variable entirely
- The region code was read in by R as a numeric variable, rather than a string. This
  wasn't a huge problem; however it raised the question of whether it was adding any
  value at all.
  
A cursory Google search yielded a [Washington Post][2] article which explained that
the reason for separating the three states mentioned above were used as benchmarks
for the US. The total observations from those three states is greater than the total
number of observations for the rest of the US, so I decided to keep them separate
from the US data, in order not to overrepresent those states in the US scores.

Impution seemed like a bad way to handle the immegration_age variable. Looking at the
birth_country variable, which is only about 1.8% NAs, its evident that most students
were born in the country in which they were taking the test. Therefore I assumed that
most of the NAs in the immegration_age variable are students who are not immigrants,
and that the limited amount of data will be helpful anyway.

The region variable I kept because I may have decided to use it later.

### Exploratory Analysis

#### Notes on Variables
- According to [Statistics Canada][3] 'Wealth' is an index determined by whether the
  student had the following at home:
  1. His or her own room
  2. A dishwasher
  3. An internet connection
  4. A DVD player
  5. Three other country-specific items
- According to the [Organization for Ecomonic Co-operation and Development][4]
  (OECD), 'ESCS', the Economic, Social and Cultural status index is based on the
  following variables:
  1. The International Socio-Economic Index of Occupational Status (ISEI)
  2. The highest level of education of the student's parents
  3. The wealth index
  4. The index of home educational resources
  5. The index of possessions related to classic culture at home.

#### Univariate Observations
- Reading, math and science scores all have normal distributions.
- Immigration age is mostly NA values.
- For immigration age values that exist, a surprising number of them are non-zero
  (>50%).

#### Bivariate observations
- Some countries perform much better than others on average
- The strongest correlation I observered was between math/science scores and the
  ESCS index (r = ~0.40).
- There is also a strong correlation between math anxiety and math scores
  (r = ~ -0.37).
- Median math score goes down significantly with all measures of truancy
- The median reading score for women appears to be about fifty points higher than
  the score for men
- The median math score is slightly higher for men than for women

#### Multivariate observations

### Visualization ideas

After looking at various plots in R, what strikes me most is the relationship
between wealth/escs and math_score. Plotting wealth against math score and
facetting by country shows that some countries have relatiively equal opportunity
for students with less family wealth and students with more, while other countries
have dramatic differences in scores between their richer and poorer students.

However, countries across the board show a generally positive correlation between
the escs index and math score, suggesting that perhaps even the countries that
seem to have equal opportunity are not as equal and they first appear.

## References

1. http://stackoverflow.com
  - [Getting row means in R][rowMeans]
  - [Dropping columns by pattern matching in R][dropColumnsPattern]
  - [Finding non-numeric data in a column R][findNonNumeric]
  - [Center a ul element][center_ul]
  - [Remove all elements from an svg with D3.js][clear_svg]
2. [Quick-R][quickr]
3. http://www.w3schools.com
  - [Creating a navigation bar with a ul element][nav_bar]
4. [Nesting in D3][nest]
5. [Drawing a line with D3][draw_line]
6. [Rounding in javascript][round]
7. [Adding arrow marker to SVG line][marker]
[1]:https://haigen.wordpress.com/sample-sas-code-for-timss-data/
[2]:http://www.washingtonpost.com/blogs/answer-sheet/wp/2013/12/03/key-pisa-test-results-for-u-s-students/
[3]:http://www.statcan.gc.ca/pub/81-595-m/2011092/section/app-ann03-eng.htm
[rowMeans]:http://stackoverflow.com/questions/9490485/how-can-i-get-the-average-mean-of-selected-columns]
[4]:http://stats.oecd.org/glossary/detail.asp?ID=5401
[dropColumnsPattern]:http://stackoverflow.com/questions/15666226/how-to-drop-columns-by-name-pattern-in-r
[findNonNumeric]:http://stackoverflow.com/questions/21196106/finding-non-numeric-data-in-an-r-data-frame-or-vector
[quickr]:http://www.statmethods.net/
[nav_bar]:http://www.w3schools.com/css/css_navbar.asp
[center_ul]:http://stackoverflow.com/questions/544207/can-you-help-me-center-a-ul-element-with-css
[clear_svg]:http://stackoverflow.com/questions/22452112/nvd3-clear-svg-before-loading-new-chart
[nest]:https://github.com/mbostock/d3/wiki/Arrays#-nest
[draw_line]:http://www.sitepoint.com/creating-simple-line-bar-charts-using-d3-js/
[round]:http://stackoverflow.com/questions/1726630/javascript-formatting-number-with-exactly-two-decimals
[marker]:https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker