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
- "ST20Q01": Country of Birth (note: ~9,000 NAs)
- "ST21Q01": Age of arrival in <country of test> (note: ~45,000 NAs)
- "ESCS": Index of economic, social and cultural status (note: ~ 12,000 NAs)
- "ANXMAT": Mathematics anxiety
- "HOMEPOS": Home possessions (note: ~6,000 NAs)
- "WEALTH": Wealth (note range: [-6.65, 3.25], median: -.3, mean: -.337, ~ 6,000 NAs

#### Predicted Values

-"PV1MATH","Plausible value 1 in mathematics"
-"PV2MATH","Plausible value 2 in mathematics"
-"PV3MATH","Plausible value 3 in mathematics"
-"PV4MATH","Plausible value 4 in mathematics"
-"PV5MATH","Plausible value 5 in mathematics"
-"PV1READ","Plausible value 1 in reading"
-"PV2READ","Plausible value 2 in reading"
-"PV3READ","Plausible value 3 in reading"
-"PV4READ","Plausible value 4 in reading"
-"PV5READ","Plausible value 5 in reading"
-"PV1SCIE","Plausible value 1 in science"
-"PV2SCIE","Plausible value 2 in science"
-"PV3SCIE","Plausible value 3 in science"
-"PV4SCIE","Plausible value 4 in science"
-"PV5SCIE","Plausible value 5 in science"

Note: The predicted values were aggregated in means over subject.



[1]:https://haigen.wordpress.com/sample-sas-code-for-timss-data/