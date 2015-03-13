#Process

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

[1]:https://haigen.wordpress.com/sample-sas-code-for-timss-data/