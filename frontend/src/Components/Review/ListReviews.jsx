const ListReviews = ({ reviews }) => {
    return (
        <div className="reviews w-75">

            <h3>Customer reviews</h3>
            <hr />
            {reviews && reviews.map(review => (
                <div key={review._id} className="review-card my-3">
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(review.rating / 5) * 100}%` }}></div>
                    </div>
                    <p className="review_user">by {review.user?.name || review.name || 'Customer'}</p>
                    <p className="review_comment">{review.comment}</p>
                    {review.createdAt && (
                        <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                    )}
                    <hr />
                </div>
            ))}
        </div>
    )

}



export default ListReviews