import csv

f = open('bikeshare.csv')
# with open('bikeshare.csv', newline='') as csvfile:
csv_f = csv.reader(f)
# csv_f.readline()


x = 0

for row in csv_f:
    # if row[4] >= 41 or row[4] <= 91:
    print(row[4])
